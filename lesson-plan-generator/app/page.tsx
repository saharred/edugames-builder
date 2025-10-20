"use client";

import { useMemo, useState } from 'react';

type FormState = {
  teacher_name: string;
  subject: string;
  grade: string;
  week: string;
  lesson_title: string;
  objectivesText: string; // multi-line, split to array
  materialsText: string;  // multi-line, split to array
  stepsText: string;       // multi-line, split to array
  assessment: string;
  homework: string;
};

function splitLinesToArray(text: string): string[] {
  return text
    .split(/\r?\n/) // split on newline
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function sanitizeFilenamePart(value: string): string {
  return value
    .replace(/\s+/g, '_')
    .replace(/[^\p{L}\p{N}_-]+/gu, '')
    .slice(0, 50) || 'file';
}

export default function Page() {
  const [form, setForm] = useState<FormState>({
    teacher_name: '',
    subject: '',
    grade: '',
    week: '',
    lesson_title: '',
    objectivesText: '',
    materialsText: '',
    stepsText: '',
    assessment: '',
    homework: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const objectives = useMemo(() => splitLinesToArray(form.objectivesText), [form.objectivesText]);
  const materials = useMemo(() => splitLinesToArray(form.materialsText), [form.materialsText]);
  const steps = useMemo(() => splitLinesToArray(form.stepsText), [form.stepsText]);

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!form.teacher_name.trim()) nextErrors.teacher_name = 'الاسم مطلوب';
    if (!form.subject.trim()) nextErrors.subject = 'المادة مطلوبة';
    if (!form.grade.trim()) nextErrors.grade = 'الصف مطلوب';
    if (!form.week.trim()) nextErrors.week = 'الأسبوع مطلوب';
    if (!form.lesson_title.trim()) nextErrors.lesson_title = 'عنوان الدرس مطلوب';
    // Arrays are optional but recommended
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        teacher_name: form.teacher_name.trim(),
        subject: form.subject.trim(),
        grade: form.grade.trim(),
        week: form.week.trim(),
        lesson_title: form.lesson_title.trim(),
        objectives,
        materials,
        steps,
        assessment: form.assessment.trim(),
        homework: form.homework.trim(),
        // helpful fallbacks for simple placeholders
        objectives_joined: objectives.join('\n'),
        materials_joined: materials.join('\n'),
        steps_joined: steps.join('\n'),
      };

      const res = await fetch('/api/generate-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const maybeJson = await res.json().catch(() => null);
        throw new Error(maybeJson?.error || 'فشل إنشاء الملف');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const teacher = sanitizeFilenamePart(form.teacher_name);
      const week = sanitizeFilenamePart(form.week);
      a.href = url;
      a.download = `lesson_plan_${teacher}_${week}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setServerError(err?.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  }

  function bind<K extends keyof FormState>(key: K) {
    return {
      value: form[key] as any,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((s) => ({ ...s, [key]: e.target.value })),
    };
  }

  return (
    <div>
      <h1>مولد خطة الدرس</h1>
      <p className="footer-note">املأ الحقول أدناه ثم اضغط "توليد ملف DOCX".</p>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label htmlFor="teacher_name">اسم المعلم</label>
            <input id="teacher_name" type="text" placeholder="مثال: أحمد علي" {...bind('teacher_name')} />
            {errors.teacher_name && <div className="error">{errors.teacher_name}</div>}
          </div>

          <div>
            <label htmlFor="subject">المادة</label>
            <input id="subject" type="text" placeholder="مثال: رياضيات" {...bind('subject')} />
            {errors.subject && <div className="error">{errors.subject}</div>}
          </div>

          <div>
            <label htmlFor="grade">الصف</label>
            <input id="grade" type="text" placeholder="مثال: الصف الخامس" {...bind('grade')} />
            {errors.grade && <div className="error">{errors.grade}</div>}
          </div>

          <div>
            <label htmlFor="week">الأسبوع</label>
            <input id="week" type="text" placeholder="مثال: الأسبوع 3" {...bind('week')} />
            {errors.week && <div className="error">{errors.week}</div>}
          </div>

          <div className="full">
            <label htmlFor="lesson_title">عنوان الدرس</label>
            <input id="lesson_title" type="text" placeholder="مثال: الكسور العشرية" {...bind('lesson_title')} />
            {errors.lesson_title && <div className="error">{errors.lesson_title}</div>}
          </div>

          <div className="full">
            <label htmlFor="objectivesText">الأهداف (سطر لكل هدف)</label>
            <textarea id="objectivesText" placeholder={"مثال:\n- يميز التلميذ بين الكسر والعدد العشري\n- يحول بين الكسور والأعداد العشرية"} {...bind('objectivesText')} />
            <div className="hint">اكتب كل هدف في سطر مستقل.</div>
          </div>

          <div className="full">
            <label htmlFor="materialsText">الوسائل التعليمية (سطر لكل عنصر)</label>
            <textarea id="materialsText" placeholder={"مثال:\n- سبورة\n- أوراق عمل\n- مسلاط (بروجكتور)"} {...bind('materialsText')} />
          </div>

          <div className="full">
            <label htmlFor="stepsText">خطوات التنفيذ (سطر لكل خطوة)</label>
            <textarea id="stepsText" placeholder={"مثال:\n- تمهيد الدرس\n- عرض الأمثلة\n- تدريب الطلاب"} {...bind('stepsText')} />
          </div>

          <div className="full">
            <label htmlFor="assessment">التقويم</label>
            <textarea id="assessment" placeholder="كيف سيتم تقويم الطلاب؟" {...bind('assessment')} />
          </div>

          <div className="full">
            <label htmlFor="homework">الواجب المنزلي</label>
            <textarea id="homework" placeholder="ما هو الواجب المطلوب؟" {...bind('homework')} />
          </div>
        </div>

        {serverError && <div className="error">{serverError}</div>}

        <div className="actions">
          <button type="submit" disabled={loading}>
            {loading ? 'جارٍ التوليد…' : 'توليد ملف DOCX'}
          </button>
        </div>
      </form>

      <p className="footer-note">لن يتم حفظ أي بيانات. لا توجد قاعدة بيانات.</p>
    </div>
  );
}
