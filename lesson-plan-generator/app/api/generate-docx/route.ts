import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

function sanitizeFilenamePart(value: string): string {
  return (value || '')
    .replace(/\s+/g, '_')
    .replace(/[^\p{L}\p{N}_-]+/gu, '')
    .slice(0, 50) || 'file';
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      teacher_name?: string;
      subject?: string;
      grade?: string;
      week?: string;
      lesson_title?: string;
      objectives?: string[];
      materials?: string[];
      steps?: string[];
      assessment?: string;
      homework?: string;
      objectives_joined?: string;
      materials_joined?: string;
      steps_joined?: string;
    };

    // Basic validation
    if (!body.teacher_name || !body.subject || !body.grade || !body.week || !body.lesson_title) {
      return NextResponse.json({ error: 'حقول أساسية مفقودة' }, { status: 400 });
    }

    const templatePath = path.join(process.cwd(), 'templates', 'ministry_template.docx');
    let content: Buffer;
    try {
      content = await fs.readFile(templatePath);
    } catch (e) {
      return NextResponse.json({ error: 'لم يتم العثور على القالب. ضع الملف في templates/ministry_template.docx' }, { status: 500 });
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Prepare data. Pass arrays for loops and also joined strings as fallbacks
    const data = {
      teacher_name: body.teacher_name,
      subject: body.subject,
      grade: body.grade,
      week: body.week,
      lesson_title: body.lesson_title,
      objectives: Array.isArray(body.objectives) ? body.objectives : [],
      materials: Array.isArray(body.materials) ? body.materials : [],
      steps: Array.isArray(body.steps) ? body.steps : [],
      assessment: body.assessment || '',
      homework: body.homework || '',
      objectives_joined: body.objectives_joined || (body.objectives ?? []).join('\n'),
      materials_joined: body.materials_joined || (body.materials ?? []).join('\n'),
      steps_joined: body.steps_joined || (body.steps ?? []).join('\n'),
    } as const;

    try {
      doc.setData(data);
      doc.render();
    } catch (error: any) {
      const message = error?.message || 'فشل تعبئة القالب';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    const teacher = sanitizeFilenamePart(data.teacher_name);
    const week = sanitizeFilenamePart(data.week);
    const filename = `lesson_plan_${teacher}_${week}.docx`;

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'خطأ غير متوقع' }, { status: 500 });
  }
}
