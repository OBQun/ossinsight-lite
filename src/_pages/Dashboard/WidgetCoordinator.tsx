import { widgets } from '@/app/bind-client';
import { move } from '@/packages/layout/src/core/types';
import { MenuItem } from '@/packages/ui/components/menu';
import { duplicateItem } from '@/src/components/WidgetsManager';
import DuplicateIcon from '@/src/icons/copy.svg';
import PaletteIcon from '@/src/icons/palette.svg';
import PencilIcon from '@/src/icons/pencil.svg';
import { getConfigurable, getDuplicable, getStyleConfigurable } from '@/src/utils/widgets';
import { readItem, useUpdater, useWatchItemFields } from '@ossinsight-lite/ui/hooks/bind';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { forwardRef, useCallback, useMemo } from 'react';
import { WidgetContextProvider } from '../../components/WidgetContext';

export interface WidgetCoordinator {
  dashboardName?: string;
  name: string;
  props: any;
  _id: string;
  editMode: boolean;
  draggable: boolean;
}

export const WidgetCoordinator = forwardRef<HTMLDivElement, WidgetCoordinator>(({ dashboardName, name, _id: id, draggable, editMode, props: passInProps }, ref) => {
  const widget = readItem(widgets, name).current;
  const styleConfigurable = getStyleConfigurable(widget);
  const configurable = getConfigurable(widget);
  const duplicable = getDuplicable(widget);

  const { props: watchingProps } = useWatchItemFields('library', id, ['props']);
  const updater = useUpdater('library', id);

  const props = { ...passInProps, ...watchingProps };

  const onPropChange = useRefCallback((key: string, value: any) => {
    updater((item) => {
      item.props = { ...item.props, [key]: value };
      return item;
    });
  });

  const Widget = widget.default;

  return (
    <WidgetContextProvider
      value={{
        enabled: true,
        editingLayout: editMode,
        configurable,
        onPropChange,
        props,
        configuring: false,
        creating: false,
      }}
    >
      <Widget ref={ref} {...props} />
    </WidgetContextProvider>
  );
});
