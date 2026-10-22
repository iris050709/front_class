export interface SideMenuProps {
    visible: boolean;
    onClose: () => void;
    onProfile: () => void;
    onSettings: () => void;
    onLogout: () => void;
}

export interface MenuItemProps {
    title: string;
    icon: string;
    onPress: () => void;
}
