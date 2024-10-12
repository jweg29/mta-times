import '@mantine/core/styles.css';

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <body>{children}</body>
        </html>

    )
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MTA Times 🚂',
    description: 'Welcome to MTA Times 🚂',
}