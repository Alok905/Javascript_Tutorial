const recipeContainer = document.querySelector(".recipe");
const timeout = function(s) {
    return new Promise(function(_, reject) {
        setTimeout(function() {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};
// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////
// 7dae4d15-fed2-486e-8369-d1268f9dc7f3
console.log("Helloooooooo");
console.log("Helloooooooo");
const showRecipe = async function() {
    try {
        const res = await fetch("https://forkify-api.herokuapp.com/api/v2/recipes");
        console.log(res);
    } catch (error) {
        console.log(error);
    }
};
showRecipe();

//# sourceMappingURL=index.62406edb.js.map
