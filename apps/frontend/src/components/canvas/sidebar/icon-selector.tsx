import clsx from "clsx";
import { useMemo } from "react";

interface IconOption<T extends string> {
    Icon: React.ComponentType<{className?: string }>;
    key: T;
}

interface IconSelectorProps<T extends string> {
    title: string;
    icons: IconOption<T>[],
    selectedIcon: T;
    setSelectedIcon: (iconId: T) => void;

}

export default function IconSelector<T extends string>({
    title,
    icons,
    selectedIcon,
    setSelectedIcon
} : IconSelectorProps<T>) {

    const iconButtons = useMemo(
    () =>
      icons.map(({ Icon, key }) => (
        <button
          key={key}
          className={clsx(
            'flex h-8 w-8 cursor-pointer items-center justify-center rounded transition-colors',
            selectedIcon === key
              ? 'bg-tool_select'
              : 'bg-gray-900 hover:bg-gray-800',
          )}
          onClick={() => {
            if (selectedIcon !== key) setSelectedIcon(key);
          }}
          aria-label={`${title} - ${key}`} // Accessibility enhancement
        >
          <Icon className='h-6 w-6' />
        </button>
      )),
    [icons, selectedIcon, setSelectedIcon, title],
  );
    
    return (    
        <>
        <div className='mb-2'>
            <p className='mb-1 text-sm font-medium'>{title}</p>
            <div className='flex gap-2'>{iconButtons}</div>
        </div>
        </>
    );
}