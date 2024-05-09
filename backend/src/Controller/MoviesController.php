<?php

namespace App\Controller;

use App\Repository\MovieRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;

class MoviesController extends AbstractController
{
    public function __construct(
        private MovieRepository $movieRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/movies', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {   
        // ORDINE PER ANNO
        // ottengo il parametro orderByYear 
        $orderByYear = $request->query->get('orderByYear');

        // verifico se il valore di orderByYear è valido, se non è valido lo imposto ASC
        if ($orderByYear !== "ASC" && $orderByYear !== "DESC") {
            $orderByYear = "ASC";
        }

        // ORDINE PER RATING
        // ottengo il parametro orderByRating 
        $orderByRating = $request->query->get('orderByRating');

        // verifico se il valore di orderByRating è valido, se non è valido lo imposto ASC
        if ($orderByRating !== "ASC" && $orderByRating !== "DESC") {
            $orderByRating = "ASC";
        }

        // inizializzo un array vuoto 
        $movies = [];

        // se è stato selezionato un ordine per rating
        if ($orderByRating) {
            // sovrascrivo
            $movies = $this->movieRepository->findOrderedByRating($orderByRating);
        }
        // se è stato selezionato un ordine per anno
        if ($orderByYear) {
            // sovrascrivo
            $movies = $this->movieRepository->findOrderedByYear($orderByYear);
        }


        
        $data = $this->serializer->serialize($movies, "json", ["groups" => "default"]);


        return new JsonResponse(['movies' => json_decode($data, true)]);
    }
}