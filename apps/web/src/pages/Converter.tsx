import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useApp } from '../contexts/AppContext';
import { getExampleById } from '../examples';

export function Converter() {
  const [searchParams] = useSearchParams();
  const { setCssInput } = useApp();

  useEffect(() => {
    const exampleId = searchParams.get('example');
    if (exampleId) {
      const example = getExampleById(exampleId);
      if (example) {
        setCssInput(example.css);
      }
    }
  }, [searchParams, setCssInput]);

  return <Layout />;
}
