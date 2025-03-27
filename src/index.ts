import { main } from './main';

(function () {
    main().catch((error) => {
        console.error('Error in main', error);
    });
})();
