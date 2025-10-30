import { useEffect, useState } from "react";

export default function ChangeTypeDevDebug({ changeTypeTo }: { changeTypeTo: React.Dispatch<React.SetStateAction<"personal" | "student">>; }) {
    const [type, setType] = useState<"student" | "personal">("student");

    useEffect(() => {
        localStorage.setItem("app-type", type);
        changeTypeTo(type);
    }, [type]);
    return (
        <div>
            <button className="border-2 border-white-50 mx-2" onClick={() => setType("student")}>aluno</button>
            <button className="border-2 border-white-50 mx-2" onClick={() => setType("personal")}>Personal</button>
        </div>
    );
}
