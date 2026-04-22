"use client";

export function NewsletterForm() {
    return (
        <form className="space-y-3" onSubmit={async (e) => {
            e.preventDefault();
            const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
            const button = e.currentTarget.querySelector('button');
            if (button) button.disabled = true;
            
            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Suscriptor Newsletter',
                        email: email,
                        phone: 'N/A',
                        message: 'Desea suscribirse al newsletter.',
                        source: 'Newsletter Blog'
                    })
                });
                if (res.ok) {
                    alert('¡Gracias por suscribirte!');
                    (e.target as HTMLFormElement).reset();
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (button) button.disabled = false;
            }
        }}>
            <input 
                type="email" 
                name="email"
                required
                placeholder="Tu email..."
                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
            />
            <button type="submit" className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50">
                Suscribirme
            </button>
        </form>
    );
}
