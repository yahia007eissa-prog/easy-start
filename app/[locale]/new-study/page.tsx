'use client';

import { NewStudyPage, DEFAULT_FORM_VALUES } from '@/components/study/NewStudyPage';

export default function NewStudyPageRoute() {
  return (
    <div className="w-full max-w-3xl">
      <NewStudyPage defaultValues={{}} />
    </div>
  );
}
