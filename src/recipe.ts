export interface Recipe {
    title: string;          // titolo della ricetta
    ingredients: string[];  // un array di stringhe contenente gli ingredienti necessari per la ricetta
    description: string;    // descrizione 
    email_author: string;   // nome dell'autore della ricetta
    idUser: string;         // identificativo utente
    prepTime: number;       // tempo di preparazione della ricetta (in minuti)
    servings: number;       // numero di porzioni che la ricetta produce
    tags: string[];         // array di stringhe contenente le etichette o le categorie a cui appartiene
    imageURL: string;       // URL di un'immagine della ricetta
    date: Date;             // data e l'ora in cui la ricetta è stata creata o aggiornata nel database
}

export interface Recipes {
    [recipeId: string]: Recipe;
}

export function 
    createRecipe(
        title: string,
        ingredients: string[],
        description: string,
        email_author: string,
        idUser: string,
        prepTime: number,
        servings: number,
        tags: string[],
        imageURL: string,
        date: Date
    ): Recipe {
        return {
            title,
            ingredients,
            description,
            email_author,
            idUser,
            prepTime,
            servings,
            tags,
            imageURL,
            date,
        };
    }
