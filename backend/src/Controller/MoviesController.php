<?php

namespace App\Controller;

use App\Entity\Genre;
use App\Repository\MovieRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class MoviesController extends AbstractController
{
    public function __construct(
        private MovieRepository $movieRepository,
        private SerializerInterface $serializer,
        private EntityManagerInterface $entityManager
    ) {}

    #[Route('/movies', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        // parametri per l'ordinamento
        $orderByYear = $request->query->get('orderByYear');
        $orderByRating = $request->query->get('orderByRating');
        $genreId = $request->query->get('genreId');
        

        // se l'ID è fornito, recupero il genere corrispondente
        if ($genreId) {
            $genres = $this->entityManager->getRepository(Genre::class)->find($genreId);
        } else {
            $genres = null;
        }

        // recupero i film in base al genere selezionato
        if ($genres) {
            $movies = $genres->getMovies();
        } else {
            // altrimenti tutti i film
            $movies = $this->movieRepository->findAll();
        }

        // controllo filtro per anno 
        if ($orderByYear) {
            $movies = $this->movieRepository->findBy([], ['year' => $orderByYear]);
        }

        // controllo filtro per rating
        if ($orderByRating) {
            $movies = $this->movieRepository->findBy([], ['rating' => $orderByRating]);
        }

        // serializzo
        $data = $this->serializer->serialize($movies, 'json', ['groups' => 'default']);
        return new JsonResponse($data, json: true);
    }
}
