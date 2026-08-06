import { StudentMaterialsList } from "@/features/student/components/student-materials-list";

export default function StudentMaterialsPage() {
  return (
    <div className="blog-content">
      <h2 className="blog-title">Materiais</h2>
      <p className="mb-4">Conteúdos liberados para o seu estudo.</p>
      <StudentMaterialsList />
    </div>
  );
}
