import { NextRequest, NextResponse } from 'next/server';
import { getWebsites, addWebsite, deleteWebsite, updateWebsite } from '@/lib/ai/trusted-websites';

export async function GET() {
  return NextResponse.json({ success: true, data: getWebsites() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, url, category, description, notes } = body;
    if (!name || !url) {
      return NextResponse.json({ success: false, error: 'name and url are required' }, { status: 400 });
    }
    const item = addWebsite({ name, url, category: category ?? '', description: description ?? '', notes: notes ?? '' });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    const updated = updateWebsite(id, rest);
    if (!updated) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    const ok = deleteWebsite(id);
    if (!ok) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
