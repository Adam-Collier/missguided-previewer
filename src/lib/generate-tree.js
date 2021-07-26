import {Parser} from "acorn";
import jsx from "acorn-jsx"

export const generateTree = (mdx) => {
    try {
        let ast = Parser.extend(jsx()).parse(mdx, { ecmaVersion: 2020 });
        return ast
    } catch (e){
        console.log("mdx not parsed");
    }
}

