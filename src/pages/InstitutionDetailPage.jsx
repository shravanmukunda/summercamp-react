import { useParams } from 'react-router-dom';
import InstitutionDetail from '../components/InstitutionDetail';

const InstitutionDetailPage = () => {
  const { id } = useParams();

  // In real app, fetch details by id
  const data = {
    id,
    name: 'Harmony Music School',
    banner: '/music-banner.jpg',
    description: 'Harmony Music School offers piano, guitar and vocal training with certified instructors.',
    address: '12/3 MG Road, Bangalore',
    phone: '+91 98765 43210',
    email: 'info@harmonymusic.in',
    rating: 4.6,
    reviewCount: 82,
    courses: [
      { id: 1, title: 'Piano (Beginner)', duration: '3 months', fee: 8000 },
      { id: 2, title: 'Guitar (Intermediate)', duration: '4 months', fee: 9500 }
    ]
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <InstitutionDetail data={data} />
    </main>
  );
};

export default InstitutionDetailPage;
