import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId, username } = await req.json();

  const bucket = "user-profile-pictures";
  const defaultFileName = `${userId}-default-user-image.png`;
  const newFileName = `${userId}-${username.toLowerCase()}-profile.png`;

  // 1. List the bucket to see if default image still exists
  const { data: files, error: listError } = await supabase.storage
    .from(bucket)
    .list("", { limit: 100 });

  if (listError) {
    return NextResponse.json({ success: false, message: listError.message });
  }

  const hasDefaultImage = files?.some((f) => f.name === defaultFileName);

  let profile_image_url: string | undefined;

  if (hasDefaultImage) {
    // 2. Copy to new file
    const { error: copyError } = await supabase.storage
      .from(bucket)
      .copy(defaultFileName, newFileName);

    if (copyError) {
      return NextResponse.json({ success: false, message: copyError.message });
    }

    // 3. Delete old file
    await supabase.storage.from(bucket).remove([defaultFileName]);

    profile_image_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${newFileName}`;

    // 4. Update profile_image_url in Users table
    const { error: dbError } = await supabase
      .from("Users")
      .update({ profile_image_url })
      .eq("id", userId);

    if (dbError) {
      return NextResponse.json({ success: false, message: dbError.message });
    }
  }

  // 5. Update displayName in auth metadata (always)
  const { error: authError } = await supabase.auth.admin.updateUserById(
    userId,
    {
      user_metadata: { displayName: username },
    }
  );

  if (authError) {
    return NextResponse.json({ success: false, message: authError.message });
  }

  return NextResponse.json({ success: true });
}
