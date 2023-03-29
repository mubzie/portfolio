export function sortElementInnerText(element: HTMLElement, className: string, type: "word" | "char") {
    // Get the text content of the element
    const text = element.innerText;

    // Split the text into words and characters
    const words = text.split(' ');
    const chars = text.split('');

    // Create arrays to store the sorted characters and spans
    const sortedWords: HTMLElement[] = [];
    const sortedChars: HTMLElement[] = [];

    // Loop through each word and create a new span for it
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.className = className;
        wordSpan.textContent = word;
        sortedWords.push(wordSpan);
    }

    // Loop through each character and create a new span for it
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        if (char === ' ') {
            // If the character is a space, add it to the sortedChars array as text content
            sortedChars.push(document.createTextNode(' ') as any);
        } else {
            // Otherwise, create a new span for the character and add it to the sortedChars array
            const charSpan = document.createElement('span');
            charSpan.style.display = 'inline-block';
            charSpan.className = className;
            charSpan.textContent = char;
            sortedChars.push(charSpan);
        }
    }

    // Replace the original text element with the sortedWords array
    element.innerHTML = '';
    if (type === "word") {
        for (let i = 0; i < sortedWords.length; i++) {
            element.appendChild(sortedWords[i]);
            // Add a space between words except for the last one
            if (i < sortedWords.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }
        }
    } else if (type === "char") {
        for (let i = 0; i < sortedChars.length; i++) {
            element.appendChild(sortedChars[i])
        }
    }


    // Return the baseInnerText and sortedChars array
    return {
        baseInnerText: text,
        sortedWords: sortedWords,
        sortedChars: sortedChars
    };
}


export function createDebounceFunc(cb: Function, delay: number) {
    let timeoutRef: null | NodeJS.Timeout = null;


    return function () {
        if (timeoutRef) {
            clearTimeout(timeoutRef);
        }

        timeoutRef = setTimeout(() => {
            cb()
            clearTimeout(timeoutRef!);
            timeoutRef = null
        }, delay)



    }
}


