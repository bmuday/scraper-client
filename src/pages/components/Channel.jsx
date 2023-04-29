import Link from "next/link";

export default function Channel({ channel }) {
  const { id, name } = channel;
  return (
    <div>
      {name} - <Link href={`/programs/${id}`}>Voir les programmes</Link>
    </div>
  );
}
