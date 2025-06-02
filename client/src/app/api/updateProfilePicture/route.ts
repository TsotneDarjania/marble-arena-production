import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;

  if (!file || !userId) {
    return NextResponse.json({
      success: false,
      message: "Missing file or userId",
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const newFileName = `${userId}-${timestamp}-profile.png`;
  const bucket = "user-profile-pictures";

  // 1. Get user's current image from DB
  const { data: userData, error: userFetchError } = await supabase
    .from("Users")
    .select("profile_image_url")
    .eq("id", userId)
    .single();

  if (userFetchError) {
    return NextResponse.json({
      success: false,
      message: userFetchError.message,
    });
  }

  const oldImageUrl: string | undefined = userData?.profile_image_url;
  const oldFilePath = oldImageUrl?.split("/").slice(-1)[0]; // extract file name from URL

  // 2. Upload new image
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(newFileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ success: false, message: uploadError.message });
  }

  // 3. Delete old image if it exists
  if (oldFilePath && oldFilePath !== newFileName) {
    await supabase.storage.from(bucket).remove([oldFilePath]);
  }

  // 4. Update DB
  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${newFileName}`;

  const { error: updateError } = await supabase
    .from("Users")
    .update({ profile_image_url: publicUrl })
    .eq("id", userId);

  if (updateError) {
    return NextResponse.json({ success: false, message: updateError.message });
  }

  return NextResponse.json({ success: true });
}
