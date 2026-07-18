import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    await client.db("visit-sri-lanka").command({
      ping: 1,
    });

    return Response.json({
      success: true,
      message: "MongoDB Connected Successfully 🚀",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "MongoDB Connection Failed",
      },
      { status: 500 }
    );
  }
}