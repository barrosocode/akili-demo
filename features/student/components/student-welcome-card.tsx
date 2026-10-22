"use client";

import { useStudentSession } from "@/features/student/hooks/use-student-session";
import type { StudentPortalSession } from "@/types/student-learning";

function firstToken(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const [first] = trimmed.split(/\s+/);
  return first || null;
}

function welcomeName(session: StudentPortalSession | null): string | null {
  if (!session) return null;
  const preferred = session.student.preferred_name?.trim();
  if (preferred) return preferred;
  return firstToken(session.student.name) ?? firstToken(session.user.name);
}

function WelcomeBulb() {
  return (
    <svg
      className="student-welcome-card__bulb"
      viewBox="0 0 168 148"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeWidth="7">
        <path d="M46 34 L34 20" stroke="#3CB44B" />
        <path d="M78 18 L78 4" stroke="#3B82F6" />
        <path d="M112 24 L126 10" stroke="#F5A623" />
        <path d="M132 52 L148 46" stroke="#F5C518" />
        <path d="M34 62 L18 56" stroke="#22A34A" />
        <path d="M58 14 L50 4" stroke="#3B82F6" />
      </g>
      <path
        d="M84 28c-24.5 0-42 17.2-42 39.2 0 14.2 7.4 25.2 16.2 31.6 2.2 1.6 3.6 4 3.6 6.6v4.2c0 3.2 2.6 5.8 5.8 5.8h32.8c3.2 0 5.8-2.6 5.8-5.8v-4.2c0-2.6 1.4-5 3.6-6.6 8.8-6.4 16.2-17.4 16.2-31.6C126 45.2 108.5 28 84 28z"
        fill="#F6C445"
        stroke="#3A2A1A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M72 62c0-9 8.2-12.5 12-6.2 3.8-6.3 12-2.8 12 6.2 0 9.2-8 14.6-12 20.4-4-5.8-12-11.2-12-20.4z"
        fill="none"
        stroke="#3A2A1A"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M70 112h28"
        stroke="#3A2A1A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="66" y="116" width="36" height="7" rx="2.5" fill="#3A2A1A" />
      <rect x="70" y="126" width="28" height="6" rx="2.5" fill="#3A2A1A" />
    </svg>
  );
}

function WelcomeLeaf() {
  return (
    <svg
      className="student-welcome-card__leaf"
      viewBox="0 0 140 90"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M140 90C108 86 62 74 28 46 52 54 88 46 118 16 124 46 134 68 140 90Z"
        fill="#9AD56A"
      />
      <path
        d="M140 90C112 78 86 62 58 58"
        fill="none"
        stroke="#6AAA4E"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StudentWelcomeCard() {
  const { session } = useStudentSession();
  const name = welcomeName(session);
  const hello = name ? `Olá, ${name}!` : "Olá!";

  return (
    <section className="student-welcome-card" aria-label="Boas-vindas">
      <div className="student-welcome-card__copy">
        <p className="student-welcome-card__hello">{hello}</p>
        <p className="student-welcome-card__title">
          Vamos continuar
          <br />
          sua jornada?
        </p>
        <p className="student-welcome-card__support">
          Aqui você aprende no seu ritmo,
          <br />
          com todo o suporte que precisa.
        </p>
      </div>
      <div className="student-welcome-card__art">
        <WelcomeBulb />
        <p className="student-welcome-card__quote">
          Pequenos
          <br />
          avanços, grandes
          <br />
          conquistas!
        </p>
      </div>
      <WelcomeLeaf />
    </section>
  );
}
