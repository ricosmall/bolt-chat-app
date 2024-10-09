import { useContext } from 'react';
import { Container } from 'inversify';
import { ContainerContext } from '../contexts/ContainerContext';

export function useInjection<T>(identifier: string | symbol): T {
  const container = useContext(ContainerContext);
  if (!container) {
    throw new Error('ContainerContext not found');
  }
  return container.get<T>(identifier);
}