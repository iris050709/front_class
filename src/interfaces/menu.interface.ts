export interface SideMenuProps {
    visible: boolean;
    onClose: () => void;
    onProfile: () => void;
    onLogout: () => void;
}

export interface MenuItemProps {
    title: string;
    icon: string;
    onPress: () => void;
}
