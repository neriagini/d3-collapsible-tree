import { useEffect, useState } from 'react';

const useClickOutside = (ref : any) => {
    const [clicked, setClicked] = useState<boolean>(false);

    useEffect(() => {
        function handleClickOutside({ target } : MouseEvent) {
            if (ref.current && !ref.current.contains(target as Node)) {
                setClicked(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);

    return [clicked, setClicked] as const;
};

export default useClickOutside;
