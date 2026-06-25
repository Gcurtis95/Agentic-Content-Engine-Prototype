import { NextResponse } from 'next/server';

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export async function POST(request) {
  if (!WEBHOOK_URL) {
    return NextResponse.json(
      { error: 'Server misconfiguration: webhook URL not set.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const upstream = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${upstream.status}` },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
