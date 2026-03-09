import {
    Navbar,
    Card,
    BlockTitle,
    Page,
} from 'konsta/react';  

export default function MainPage() {
    return (
        <Page>
            <Navbar title="Cards" />

            <BlockTitle>Simple Cards</BlockTitle>
            <Card>
                This is a simple card with plain text, but cards can also contain their
                own header, footer, list view, image, or any other element.
            </Card>

            {/* ... Sisa kode Card Anda yang lain ... */}

            <BlockTitle>Raised Cards</BlockTitle>
            <Card raised header="Card header" footer="Card footer">
                Card with header and footer.
            </Card>
        </Page>
    )
}