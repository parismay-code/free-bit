import { useFormikContext } from 'formik';

type FileUploadProps = {
    name: string;
    accept?: string;
    multiple?: boolean;
};

export function FileUpload(props: FileUploadProps) {
    const { setFieldValue } = useFormikContext();

    return (
        <input
            type="file"
            name={props.name}
            accept={props.accept}
            multiple={props.multiple}
            onChange={async (event) => {
                const { files } = event.currentTarget;

                if (files) {
                    await setFieldValue(
                        props.name,
                        props.multiple ? files : files[0],
                    );
                }
            }}
        />
    );
}
