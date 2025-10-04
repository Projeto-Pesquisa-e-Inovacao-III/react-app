
export default function HeaderDesktop() {

    return (
        <>
            <header className="w-full absolute flex items-center border-b h-20 p-[20px] p-5 pl-25 pr-25">
                <div>
                    <img src="https://placehold.co/90x40" alt="logo" className="border-2" />
                </div>
                <nav className="mt-0 mb-0 ml-auto mr-auto flex gap-10">
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Services</a>
                    <a href="#">Contact</a>
                </nav>
            </header>
        </>
    );
}
