import { Editor, Frame } from '@craftjs/core';
import { Container } from '../NoCodeToolsComponents/Container';
import EditableText from '../NoCodeToolsComponents/EditableText';
import EditableImage from '../NoCodeToolsComponents/EditableImage';
import ViewButton from '../NoCodeToolsComponents/ViewButton';
import { EditableSection } from '../NoCodeToolsComponents/EditableSection';

type Props = {
    content: string;
};

export default function NoCodeRenderer({ content }: Props) {
    return (
        <Editor
            enabled={false}
            resolver={{
                Container,
                EditableText,
                EditableImage,
                EditableButton: ViewButton,
                EditableSection,
            }}
            onRender={({ render }) => render}
        >
            <Frame data={content} />
        </Editor>
    );
}
