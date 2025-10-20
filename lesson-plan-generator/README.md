## مولد خطة الدرس (Next.js + TypeScript)

مولد بسيط يقوم بتعبئة قالب الوزارة لخطط الدروس وإنتاج ملف DOCX قابل للتنزيل.

### المتطلبات
- Node.js 18+
- لا توجد قاعدة بيانات. لا أسرار مطلوبة.

### التثبيت والتشغيل
```bash
cd lesson-plan-generator
npm install
npm run dev
```
ثم افتح `http://localhost:3001`.

### وضع القالب
- ضع ملف القالب في المسار: `templates/ministry_template.docx`
- يجب أن يحتوي القالب على العناصر النائبة (Placeholders) التالية:
  - `{teacher_name}`
  - `{subject}`
  - `{grade}`
  - `{week}`
  - `{lesson_title}`
  - `{assessment}`
  - `{homework}`
  - قوائم (تكرار العناصر):
    - الأهداف: استخدم قسم تكرار بالشكل:
      - في الفقرة/السطر الأول ضع: `{#objectives}`
      - في الفقرة التالية اكتب: `{.}` داخل عنصر نقطي (Bullet)
      - في الفقرة الختامية ضع: `{/objectives}`
    - الوسائل: `{#materials}` ثم `{.}` ثم `{/materials}` بنفس الطريقة
    - الخطوات: `{#steps}` ثم `{.}` ثم `{/steps}`

ملاحظات:
- بدلاً من التكرار، يمكنك استخدام العناصر: `{objectives_joined}`, `{materials_joined}`, `{steps_joined}` لوضعها كسرد نصي واحد مفصول بأسطر جديدة.
- يفضّل إعداد القوائم كـ Bulleted List في Word ووضع `{.}` داخل كل عنصر.

### كيف يعمل
- الواجهة (`/`) تعرض نموذجًا عربيًا باتجاه RTL يجمع بيانات الخطة.
- عند الإرسال يتم إرسال JSON إلى واجهة برمجية `/api/generate-docx`.
- الخادم يقرأ `templates/ministry_template.docx` ويملأ العناصر النائبة ويعيد ملف DOCX مع ترويسة تنزيل `Content-Disposition: attachment`.

### الحقول
- اسم المعلم: `teacher_name`
- المادة: `subject`
- الصف: `grade`
- الأسبوع: `week`
- عنوان الدرس: `lesson_title`
- الأهداف (قائمة): `objectives` (و`objectives_joined`)
- الوسائل (قائمة): `materials` (و`materials_joined`)
- خطوات التنفيذ (قائمة): `steps` (و`steps_joined`)
- التقويم: `assessment`
- الواجب المنزلي: `homework`

### الأمان
- لا يتم تخزين أي بيانات.
- لا توجد أسرار في الواجهة؛ أي إعدادات مستقبلية توضع في متغيرات بيئية داخل الخادم فقط.

### الإنتاج
- استخدم `npm run build` ثم `npm start` لتشغيل الخادم على المنفذ 3001.
