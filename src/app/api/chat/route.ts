import { NextResponse } from "next/server";
import { initialMenuData } from "@/lib/restaurant-data";

const JINA_API_KEY = process.env.JINA_API_KEY || "";

// Build context string from menu items (our "knowledge base")
function buildContext(items: typeof initialMenuData) {
  return items.map((item) => {
    return `Item: ${item.name}
Category: ${item.category}
Price: ₹${item.price}
Description: ${item.description}
Ingredients: ${(item.ingredients || []).join(", ")}
Making Process: ${item.makingOf || "Prepared fresh to order."}
Portions Left: ${item.portionsLeft ?? "Available"}
Prep Time: ${item.prepTime ?? "15 mins"}
Viral Score: ${item.viralScore ?? "N/A"}/100
---`;
  }).join("\n");
}

// Simple keyword relevance scoring against menu items
function findRelevantItems(query: string, items: typeof initialMenuData, topK = 4) {
  const q = query.toLowerCase();
  const scored = items.map((item) => {
    let score = 0;
    const text = `${item.name} ${item.category} ${item.description} ${(item.ingredients || []).join(" ")}`.toLowerCase();
    // Keyword matches
    const words = q.split(/\s+/).filter((w) => w.length > 2);
    words.forEach((word) => { if (text.includes(word)) score += 2; });
    // Category matches
    if (q.includes("burger") && item.category === "Burgers & Fries") score += 5;
    if (q.includes("pizza") && item.category === "Artisan Pizzas") score += 5;
    if (q.includes("dessert") || q.includes("sweet")) { if (item.category === "Desserts & Specials") score += 5; }
    if (q.includes("drink") || q.includes("beverage")) { if (item.category === "Beverages & Mocktails") score += 5; }
    if (q.includes("veg") || q.includes("vegetarian")) { if (!item.description.toLowerCase().includes("chicken") && !item.description.toLowerCase().includes("meat")) score += 3; }
    if (q.includes("spicy") || q.includes("hot")) { if (item.ingredients?.some((i) => i.toLowerCase().includes("chilli") || i.toLowerCase().includes("spice"))) score += 3; }
    if (q.includes("cheap") || q.includes("affordable") || q.includes("budget")) { if (item.price < 200) score += 4; }
    if (q.includes("viral") || q.includes("popular") || q.includes("best")) { score += (item.viralScore ?? 0) / 20; }
    return { item, score };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, topK).map((s) => s.item);
}

// Generate a response using Jina AI embeddings for context, then craft a reply
async function generateResponse(query: string, relevantItems: typeof initialMenuData): Promise<string> {
  // Build focused context from relevant items only
  const context = buildContext(relevantItems);

  // Use Jina Reader/Chat endpoint for answer generation
  try {
    const response = await fetch("https://api.jina.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JINA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "jina-chat",
        messages: [
          {
            role: "system",
            content: `You are VibeBot 🤖, the friendly AI food assistant for VibeServe restaurant. 
You help customers discover delicious dishes, understand ingredients, and make great food choices.
Be enthusiastic, use food emojis, keep answers concise (2-4 sentences max).
Always recommend specific dishes from the menu when relevant.
Here is the current menu knowledge base:

${context}`,
          },
          {
            role: "user",
            content: query,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content || fallbackResponse(query, relevantItems);
    }
  } catch {
    // Fall through to local response
  }

  return fallbackResponse(query, relevantItems);
}

function fallbackResponse(query: string, items: typeof initialMenuData): string {
  const q = query.toLowerCase();

  if (items.length === 0) {
    return "Hmm, I couldn't find anything matching that! 🤔 Try asking about our burgers, pizzas, desserts, or beverages!";
  }

  const top = items[0];
  const names = items.map((i) => `**${i.name}** (₹${i.price})`).join(", ");

  if (q.includes("ingredient") || q.includes("made") || q.includes("how")) {
    return `🧑‍🍳 The **${top.name}** is made with: ${(top.ingredients || []).join(", ")}. ${top.makingOf?.split(".")[0] || "Freshly crafted every order!"}`;
  }
  if (q.includes("price") || q.includes("cost") || q.includes("how much")) {
    return `💰 Here are some great options: ${names}. All freshly made and worth every rupee! 🔥`;
  }
  if (q.includes("recommend") || q.includes("suggest") || q.includes("best")) {
    return `⭐ I'd recommend the **${top.name}** (₹${top.price}) — ${top.description.slice(0, 100)}... It has a viral score of ${top.viralScore}/100! 🔥`;
  }
  if (q.includes("spicy") || q.includes("hot")) {
    return `🌶️ Looking for heat? Check out ${names}. They pack serious spice! Ask your server about spice levels.`;
  }

  return `🍽️ Great choice! Here's what we have for you: ${names}. The **${top.name}** at ₹${top.price} is especially popular — ${top.description.slice(0, 80)}!`;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    // Find relevant menu items using keyword scoring
    const relevant = findRelevantItems(message, initialMenuData);

    // Generate response
    const reply = await generateResponse(message, relevant);

    // Return response with source items for display
    return NextResponse.json({
      reply,
      sources: relevant.slice(0, 2).map((item) => ({
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
      })),
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { reply: "Sorry, I'm having a moment! 😅 Try asking about our best dishes or specific categories like burgers, pizzas, or desserts!" },
      { status: 200 }
    );
  }
}
