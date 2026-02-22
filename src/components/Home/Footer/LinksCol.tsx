type LinksColProps = {
    title: string;
    firstPage: string;
    firstPageName: string;
    secondPage?: string;
    secondPageName?: string;
    thirdPage?: string;
    thirdPageName?: string;
};

export default function LinksCol({ title, firstPage, firstPageName, secondPage, secondPageName, thirdPage, thirdPageName }: LinksColProps) {
    return (
        <div id="col" className="flex flex-col justify-between">
            <h5 className="font-bold">{title}</h5>
            <a className="underline mt-3" href={firstPage}>{firstPageName}</a>
            {secondPage && secondPageName && <a className="underline mt-3 " href={secondPage}>{secondPageName}</a>}
            {thirdPage && thirdPageName && <a className="underline mt-3" href={thirdPage}>{thirdPageName}</a>}
        </div>
    );
}
