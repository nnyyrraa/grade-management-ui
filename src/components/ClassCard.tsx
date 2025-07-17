import Link from "next/link";

type Props = {
  id: string;
  name: string;
  semester: string;
  studentCount: number;
  isConfigured: boolean;
};

export default function ClassCard({ id, name, semester, studentCount, isConfigured }: Props) {
  return (
    <div className="bg-[#0C3C82] text-white p-4 rounded-lg shadow-md space-y-2">
      <h3 className="text-lg font-bold">{name}</h3>
      <p>Semester : {semester}</p>
      <p>Mahasiswa : {studentCount}</p>
      <p>
        Status :{" "}
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            isConfigured ? "bg-yellow-500" : "bg-red-600"
          }`}
        >
          {isConfigured ? "Sudah Konfigurasi" : "Belum Konfigurasi"}
        </span>
      </p>

      <Link href={`/konfigurasi/${id}`}>
        <button className="w-full md:w-auto bg-[#EDF3FC] text-[#093669] px-4 py-1 rounded ease-in-out hover:shadow-md hover:shadow-white/30 hover:-translate-y-0.5">
          Detail
        </button>
      </Link>
    </div>
  );
}
