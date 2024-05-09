<?php

namespace App\Controller;

use App\Repository\MovieRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class MoviesController extends AbstractController
{
    public function __construct(
        private MovieRepository $movieRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/movies', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        // prendiamo i parametri per l'ordinamento
        $orderByYear = $request->query->get('orderByYear');
        $orderByRating = $request->query->get('orderByRating');

        // recupero i film 
        $movies = $this->movieRepository->findAll();

        // se filtriamo per anno 
        if ($orderByYear) {
            $movies = $this->movieRepository->findBy([], ['year' => $orderByYear]);
        }

        // se filtriamo per rating
        if ($orderByRating) {
            $movies = $this->movieRepository->findBy([], ['rating' => $orderByRating]);
        }

        
        $data = $this->serializer->serialize($movies, "json", ["groups" => "default"]);

        return new JsonResponse($data, json: true);
    }
}
