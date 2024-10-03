import { createStore } from 'vuex'
import playPuzzle from './modules/playPuzzle';
import createPuzzle from './modules/createPuzzle';
import Authentication from './modules/Authentication';
import getAllPuzzlesLocal from './modules/getAllPuzzlesLocal';
import getAllPuzzlesFederation from './modules/getAllPuzzlesFederation';
import comments from './modules/comments';
import createSkyscraper from './modules/createSkyscraper';

export const store = createStore({
    modules: {
        playPuzzle,
        createPuzzle,
        Authentication,
        getAllPuzzlesLocal,
        getAllPuzzlesFederation,
        comments,
        createSkyscraper,
    }
});