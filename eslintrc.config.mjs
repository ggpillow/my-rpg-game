import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        pligins: {
            extends: ["airbnb-base/legacy"]
        },
    }
];
