/**
 * Pejji Lead Logger - Cloudflare Worker
 * Receives lead data from contact form, creates entry in Notion Clients DB
 * POST /log-lead with JSON body
 */

const NOTION_API_KEY = "ntn_d96777609438ooOy22lk9oNi00PZLwWyEYfh6jThZlo6rV";
const NOTION_DB_ID = "0018a870-790a-4103-9ab7-d95272ce80b8";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "POST only" }), {
        status: 405,
        headers: CORS_HEADERS,
      });
    }

    try {
      const lead = await request.json();

      // Validate required fields
      if (!lead.business_name && !lead.your_name) {
        return new Response(JSON.stringify({ error: "Missing lead data" }), {
          status: 400,
          headers: CORS_HEADERS,
        });
      }

      // Map tier to Recommended Tier values
      const tierMap = {
        card: "Card",
        starter: "Starter",
        growth: "Growth",
        pro: "Pro",
      };

      // Map industry to Notion select values
      const industryMap = {
        restaurant: "Restaurant/Food",
        retail: "Retail/E-commerce",
        services: "Services",
        beauty: "Health/Beauty",
        education: "Education",
        realestate: "Real Estate",
        tech: "Tech/Startup",
        logistics: "Logistics",
        fashion: "Fashion",
        other: "Other",
      };

      // Build Notion page properties
      const properties = {
        "Business Name": {
          title: [{ text: { content: lead.business_name || "Unknown Business" } }],
        },
        "Contact Name": {
          rich_text: [{ text: { content: lead.your_name || "" } }],
        },
        Status: {
          select: { name: "Lead" },
        },
        Priority: {
          select: { name: "Hot" },
        },
        "Lead Source": {
          select: { name: "Website" },
        },
        Notes: {
          rich_text: [
            {
              text: {
                content: `About: ${lead.about || "-"}\nHas Logo: ${lead.has_logo || "-"}\nSource: pejji.com/contact`,
              },
            },
          ],
        },
      };

      // Add optional fields only if they have values
      if (lead.phone) {
        properties["Phone"] = { phone_number: lead.phone };
      }
      if (lead.email) {
        properties["Email"] = { email: lead.email };
      }
      if (lead.tier && tierMap[lead.tier]) {
        properties["Recommended Tier"] = {
          select: { name: tierMap[lead.tier] },
        };
      }
      if (lead.industry && industryMap[lead.industry]) {
        properties["Industry"] = {
          select: { name: industryMap[lead.industry] },
        };
      }

      // Create Notion page
      const notionRes = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent: { database_id: NOTION_DB_ID },
          properties,
        }),
      });

      const notionResult = await notionRes.json();

      if (notionResult.id) {
        return new Response(
          JSON.stringify({ success: true, notion_id: notionResult.id }),
          { headers: CORS_HEADERS }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, error: notionResult.message || "Notion error" }),
          { status: 500, headers: CORS_HEADERS }
        );
      }
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: CORS_HEADERS }
      );
    }
  },
};
