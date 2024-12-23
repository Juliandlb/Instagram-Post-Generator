import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    // Step 1: Generate the image using DALL-E
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      n: 1,
      quality: "standard",
    });

    const imageUrl = imageResponse.data[0]?.url;

    // Step 2: Generate a caption using GPT, following the documentation format
    let caption = "";
    if (imageUrl) {
      const captionResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "You are a social media expert. Write an engaging, 100-word Instagram caption for the image. Make the caption general enough to describe the scene or mood, and include creative, positive language that resonates with Instagram users. Add 5–10 relevant hashtags based on the image's content, ensuring the hashtags are popular but not overly generic. Keep the tone friendly and Instagram-appropriate." },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      });

      // Safely assign content or fallback to an empty string
      caption = captionResponse.choices[0]?.message?.content ?? "";
    }

    // Send back the generated image and caption
    return NextResponse.json({
      imageUrl,
      caption,
    });
  } catch (error) {
    console.error("Error generating image or caption:", error);
    return NextResponse.json({ error: "Failed to generate image or caption." }, { status: 500 });
  }
}
