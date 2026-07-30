import { NextResponse } from "next/server";
import { initialMenuData } from "@/lib/restaurant-data";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Build a rich context string from the full menu (the "knowledge base" for RAG)
function buildMenuContext() {
  return initialMenuData
    .map(
      (item) => `
ITEM: ${item.name}
CATEGORY: ${item.category}
PRICE: ₹${item.price}
DESCRIPTION: ${item.description}
INGREDIENTS: ${(item.ingredients || []).join(", ")}
MAKING PROCESS: ${item.makingOf || "Prepared fresh to order."}
PORTIONS LEFT TODAY: ${item.portionsLeft ?? "Available"}
PREP TIME: ${item.prepTime ?? "15 mins"}
VIRAL SCORE: ${item.viralScore ?? "N/A"}/100
TAG: ${item.tag ?? ""}
---`
    )
    .join("\n");
}

// Simple keyword scoring to find the most relevant menu items for a query
function findRelevantItems(query: string, topK = 3) {
  const q = query.toLowerCase();
  const scored = initialMenuData.map((item) => {
    let score = 0;
    const text =
      `${item.name} ${item.category} ${item.description} ${(item.ingredients || []).join(" ")} ${item.tag ?? ""}`.toLowerCase();

    // Word-level matching
    const words = q.split(/\s+/).filter((w) => w.length > 2);
    words.forEach((word) => { if (text.includes(word)) score += 2; });

    // Category intent signals
    if ((q.includes("burger") || q.includes("bun")) && item.category === "Burgers & Fries") score += 6;
    if ((q.includes("pizza") || q.includes("artisan")) && item.category === "Artisan Pizzas") score += 6;
    if ((q.includes("dessert") || q.includes("sweet") || q.includes("chocolate")) && item.category === "Desserts & Specials") score += 6;
    if ((q.includes("drink") || q.includes("beverage") || q.includes("juice") || q.includes("mocktail")) && item.category === "Beverages & Mocktails") score += 6;
    if ((q.includes("pasta") || q.includes("noodle")) && item.category === "Pasta & Bowls") score += 6;

    // Attribute signals
    if ((q.includes("spicy") || q.includes("hot") || q.includes("chilli")) && item.ingredients?.some((i) => i.toLowerCase().match(/chilli|spice|pepper|jalapeno/))) score += 4;
    if ((q.includes("cheap") || q.includes("affordable") || q.includes("budget")) && item.price < 200) score += 5;
    if ((q.includes("expensive") || q.includes("premium") || q.includes("luxury")) && item.price > 350) score += 5;
    if ((q.includes("viral") || q.includes("popular") || q.includes("best") || q.includes("trending"))) score += (item.viralScore ?? 0) / 15;
    if ((q.includes("veg") || q.includes("vegetarian")) && !text.match(/chicken|mutton|prawn|fish|meat/)) score += 3;

    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.item);
}

// Fallback when Gemini API key is not set
function localFallback(query: string, items: typeof initialMenuData) {
  if (!items.length) {
    return "Hmm, I couldn't find anything matching that! 🤔 Try asking about burgers, pizzas, desserts, or beverages!";
  }
  const top = items[0];
  const q = query.toLowerCase();
  const nameList = items.map((i) => `**${i.name}** (₹${i.price})`).join(", ");

  if (q.match(/ingredient|made of|contain|what.s in/)) {
    return `🧑‍🍳 **${top.name}** is made with: ${(top.ingredients || []).join(", ")}. ${top.makingOf?.split(".")[0] || "Freshly crafted every order!"}`;
  }
  if (q.match(/price|cost|how much|expensive|cheap/)) {
    return `💰 Here are some great options: ${nameList}. All freshly made and worth every rupee! 🔥`;
  }
  if (q.match(/recommend|suggest|best|popular|viral|trending/)) {
    return `⭐ I'd recommend the **${top.name}** (₹${top.price}) — ${top.description.slice(0, 100)}... Viral score: ${top.viralScore}/100! 🔥`;
  }
  return `🍽️ Check out: ${nameList}. The **${top.name}** at ₹${top.price} is especially popular — ${top.description.slice(0, 80)}!`;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    // Find relevant items for RAG context
    const relevant = findRelevantItems(message);
    const allContext = buildMenuContext();

    let reply: string;

    if (GEMINI_API_KEY) {
      // Use Gemini with full RAG context
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are VibeBot 🤖, the friendly and enthusiastic AI food assistant for VibeServe — a viral social-first restaurant.

Your personality: warm, fun, use food emojis generously, keep responses concise (3-5 sentences max), always recommend specific dishes.

Here is the COMPLETE menu knowledge base:
${allContext}

Based on the menu above, answer this customer question:
"${message}"

Rules:
- Always mention specific dish names and prices (₹) from the menu
- If asking about ingredients or how something is made, give the step-by-step making-of process
- If asking for recommendations, pick the most relevant dishes with viral scores
- Never make up dishes not in the menu
- End with an encouraging call-to-action`;

      const result = await model.generateContent(prompt);
      reply = result.response.text();
    } else {
      // Fallback: local keyword-based response
      reply = localFallback(message, relevant);
    }

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
      {
        reply: "I had a quick hiccup! 😅 Try asking about our best dishes, ingredients, or specific categories like burgers, pizzas, or desserts!",
        sources: [],
      },
      { status: 200 }
    );
  }
}
