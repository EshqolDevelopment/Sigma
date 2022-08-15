import React from "react";
import AceEditor from "react-ace";
import 'brace/mode/python';
import 'brace/mode/kotlin';
import 'brace/mode/java';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'brace/theme/github';
import 'brace/theme/tomorrow';
import 'brace/theme/eclipse';
import 'brace/theme/twilight';
import 'brace/theme/xcode';
import 'brace/theme/chrome';
import 'brace/theme/clouds';
import 'brace/theme/crimson_editor';


type Props = {
    code: string,
    setCode: (code: string) => void,
    language?: string,
    fontSize?: number,
    theme?: string,
    lineNumbers?: boolean,
}


export default function Editor(props: Props) {

    return (
        <AceEditor
            mode={props.language || 'python'}
            fontSize={props.fontSize || 16}
            theme={props.theme || 'monokai'}
            style={{width: '100%', height: '100%'}}
            showPrintMargin={true}
            highlightActiveLine={true}
            value={props.code}

            setOptions={{
                showLineNumbers: true,
                behavioursEnabled: true,
                showGutter: props.lineNumbers ?? true,
                tabSize: 2
            }}

            onChange={(value) => {
                props.setCode(value)
            }}
        />
    )
}
