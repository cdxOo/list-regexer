import React, { useState} from 'react';
import {
    DefaultForm,
    ThemeContext,
    FallbackTheme,
    withField
} from '@cdxoo/formik-utils';

const StringField = withField({
    Control: (ps) => {
        var { formikField } = ps;
        return (
            <input
                style={{ padding: '5px', width: '100%' }}
                type='text' { ...formikField }
            />
        )
    }
})

const UserTextField = withField({
    Control: (ps) => {
        var { formikField } = ps;
        return (
            <textarea
                style={{ width: '100%', minHeight: '400px' }}
                { ...formikField }
            />
        )
    }
})

const Theme = FallbackTheme;

export const App = (ps) => {
    var [ output, setOutput ] = useState('');

    var submit = (formData) => {
        var { theRegex, outputTransformation, userText } = formData;
        console.log(formData);

        var rx = new RegExp(theRegex);
        var transformedLines = userText.split(/\n/).map(it => {
            var matched = it.match(rx);
            var transformed = (
                outputTransformation
                .replace(/\$(\d+)/g, (m, replaceIndex) => {
                    return matched[replaceIndex];
                })
            );
            return transformed;
        });

        setOutput(transformedLines.join("\n"))
    };

    var initialValues = {
        theRegex: '^\\s*\\d+\\.?\\s*(\\w+)\\s*-?\\s*(\\w+)',
        outputTransformation: '"$1", "$2"',
        userText: [
            "   1. MyDude - SomeSong",
            "  2 SomeGirl OtherSong"
        ].join("\n")
    }

    return (
        <ThemeContext.Provider value={ Theme }>
            <DefaultForm
                initialValues={ initialValues }
                validateOnChange={ false }
                validateOnBlur={ false }
                onSubmit={ submit }
            >
                {(formikProps) => (
                    <>
                        <div style={{
                            float: 'left',
                            width: '49%',
                            padding: '0.25rem'
                        }}>
                            <div style={{ marginBottom: '10px' }}>
                                <StringField
                                    label='Regex'
                                    dataXPath='theRegex'
                                />
                            </div>
                            <UserTextField
                                dataXPath='userText'
                            />
                        </div>
                        <div style={{
                            marginLeft: '50%',
                            padding: '0.25rem'
                        }}>
                            <div style={{ marginBottom: '10px' }}>
                                <StringField
                                    label='Transformation'
                                    dataXPath='outputTransformation'
                                />
                            </div>
                            <div>
                                <button type='submit'>TRANSFORM</button>
                            </div>
                            <hr />
                            OUTPUT:
                            <pre style={{
                                margin: 0,
                                padding: '1rem',
                                border: '1px solid black'
                            }}>
                                { output }
                            </pre>
                        </div>
                    </>
                )}
            </DefaultForm>
        </ThemeContext.Provider>
    )
}
