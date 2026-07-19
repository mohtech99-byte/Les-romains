import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const supabaseBucket = process.env.SUPABASE_BUCKET || 'media';

let supabaseClient: any = null;

// Initialize Supabase only if environment variables exist
if (supabaseUrl && supabaseServiceKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      }
    });
    console.log('Supabase storage client initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
} else {
  console.log('Supabase credentials missing. Local filesystem fallback active.');
}

export async function uploadFileToStorage(file: Express.Multer.File): Promise<{ url: string; name: string; size: string; mimeType: string }> {
  const fileExt = path.extname(file.originalname);
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${fileExt}`;
  const sizeStr = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
  const mimeType = file.mimetype;

  // 1. Try Supabase Storage if configured
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.storage
        .from(supabaseBucket)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabaseClient.storage
        .from(supabaseBucket)
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        return {
          url: publicUrlData.publicUrl,
          name: file.originalname,
          size: sizeStr,
          mimeType,
        };
      }
    } catch (error) {
      console.error('Supabase upload failed, falling back to local storage:', error);
    }
  }

  // 2. Fallback: Save file locally
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const localFilePath = path.join(uploadsDir, fileName);
  await fs.promises.writeFile(localFilePath, file.buffer);
  
  const publicUrl = `/uploads/${fileName}`;
  return {
    url: publicUrl,
    name: file.originalname,
    size: sizeStr,
    mimeType,
  };
}
