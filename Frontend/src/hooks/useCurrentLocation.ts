import { useLocation } from "react-router-dom"
type AvailablePages = 'home' | 'recents' | 'access' | 'profile' | 'colors'
const useCurrentLocation = () => {
    const {pathname}  = useLocation();
    const pathParts = pathname.split('/').filter(Boolean);
    let rawPage : AvailablePages = pathParts[1] as AvailablePages
    let pageName : AvailablePages = rawPage || 'home'
    return {pageName}

}

export default useCurrentLocation