export default function Footer() {
    return (
        <footer>
            <div className="bg-black p-5 text-white text-center">
                <div className="flex flex-row justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </div>
                <p>&copy; 2024 CSF Treinamentos. Todos os direitos reservados.</p>
                <div className="flex justify-center mt-3">
                    <img src="https://placehold.co/90x40" alt="logo" />
                </div>
            </div>
        </footer>
    );
}