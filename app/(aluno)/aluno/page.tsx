import Link from "next/link";

/**
 * Home do aluno — placeholder documentado (PORTAL-012/013).
 * API de conteúdo/disciplinas ainda não exposta no BFF do site.
 */
export default function AlunoHomePage() {
  return (
    <div className="blog-content">
      <h2 className="blog-title">Área do aluno</h2>
      <p>
        Bem-vindo à área de estudos. As disciplinas, cadernos e verificações de
        aprendizado serão carregados pela API do aluno — enquanto isso, use o
        menu para conhecer a estrutura da jornada.
      </p>
      <ul>
        <li>
          <Link href="/aluno/disciplinas">Ver disciplinas</Link>
        </li>
        <li>
          <Link href="/aluno/cadernos">Ver cadernos</Link>
        </li>
        <li>
          <Link href="/aluno/recentes">Conteúdos recentes</Link>
        </li>
      </ul>
    </div>
  );
}
