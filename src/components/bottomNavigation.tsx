import {
    Tabbar,
    TabbarLink,
    ToolbarPane,
} from 'konsta/react';
import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from '@tanstack/react-router';

export default function BottomNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    function handleNavigate(url: string) {
        navigate({ to: url as any });
    }

    const activeColor = "text-primary";
    const inactiveColor = "text-gray-400";

    return (
        <Tabbar
            {...({
                labels: true,
                icons: true,
                bgClassName: "bg-white/70 dark:bg-black/60 backdrop-blur-md",
                className: "left-0 bottom-0 fixed h-16 flex items-center"
            } as any)}
        >
            <ToolbarPane>
                <TabbarLink
                    onClick={() => handleNavigate('/')}
                    icon={
                        <Icon
                            height={24}
                            icon={"boxicons:home"}
                            className={isActive('/') ? activeColor : inactiveColor}
                        />
                    }
                    label={
                        <p className={isActive('/') ? activeColor : inactiveColor}>Home</p>
                    }
                />

                <TabbarLink
                    onClick={() => handleNavigate('/favorite')}
                    icon={
                        <Icon
                            height={24}
                            icon={"material-symbols:favorite-outline-rounded"}
                            className={isActive('/favorite') ? activeColor : inactiveColor}
                        />
                    }
                    label={
                        <p className={isActive('/favorite') ? activeColor : inactiveColor}>Favorit</p>
                    }
                />

                <TabbarLink
                    onClick={() => handleNavigate('/history')}
                    icon={
                        <Icon
                            height={24}
                            icon="material-symbols:history-rounded"
                            className={isActive('/history') ? activeColor : inactiveColor}
                        />
                    }
                    label={
                        <p className={isActive('/history') ? activeColor : inactiveColor}>Histori</p>
                    }
                />

                <TabbarLink
                    onClick={() => handleNavigate('/profile')}
                    icon={
                        <Icon
                            height={24}
                            icon={"boxicons:user"}
                            className={isActive('/profile') ? activeColor : inactiveColor}
                        />
                    }
                    label={
                        <p className={isActive('/profile') ? activeColor : inactiveColor}>Profil</p>
                    }
                />
            </ToolbarPane>
        </Tabbar>
    );
}