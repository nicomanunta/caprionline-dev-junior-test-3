<?php

namespace App\Repository;

use App\Entity\Movie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Movie>
 *
 * @method Movie|null find($id, $lockMode = null, $lockVersion = null)
 * @method Movie|null findOneBy(array $criteria, array $orderBy = null)
 * @method Movie[]    findAll()
 * @method Movie[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MovieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Movie::class);
    }


    // film ordinati per anno. 
    public function findOrderedByYear(string $orderBy): array
    { 
        return $this->createQueryBuilder('m')->orderBy('m.year', $orderBy)->getQuery()->getResult();
    }

    //film ordinati per voto.  
    public function findOrderedByRating(string $orderBy): array
    {
        return $this->createQueryBuilder('m')->orderBy('m.rating', $orderBy)->getQuery()->getResult();
    }
}
