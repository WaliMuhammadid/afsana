import { fal } from "@fal-ai/client";

/**
 * Configure Fal client. 
 * We assume process.env.FAL_KEY is available in the environment.
 */
fal.config({
  credentials: (typeof window !== 'undefined' ? (window as any).process?.env?.FAL_KEY : undefined) || (typeof process !== 'undefined' ? process.env?.FAL_KEY : undefined),
});

export interface VtoInput {
  humanImage: string;
  garmentImage: string;
  description?: string;
}

/**
 * Executes a high-fidelity Virtual Try-On using Fal.ai's IDM-VTON model.
 * This provides superior results for fashion applications compared to general LLM synthesis.
 */
export const executeFalVto = async (input: VtoInput): Promise<string> => {
  try {
    // The IDM-VTON model is specifically designed for virtual try-on tasks,
    // providing garment-aware synthesis that respects fabric texture and human anatomy.
    const result: any = await fal.subscribe("fal-ai/idm-vton", {
      input: {
        human_img: input.humanImage,
        garment_img: input.garmentImage,
        garment_des: input.description || "a premium garment",
      },
      pollInterval: 5000,
      logs: true,
    });

    if (result.data && result.data.image && result.data.image.url) {
      return result.data.image.url;
    }
    
    throw new Error("Fal.ai synthesis engine failed to return an image URL.");
  } catch (error) {
    console.error("Fal.ai VTO Error:", error);
    throw error;
  }
};