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

        // Verifica se il valore di orderByYear è valido, se non è valido lo imposto ASC
        if ($orderByYear !== "ASC" && $orderByYear !== "DESC") {
            
            $orderByYear = "ASC";
        }

    // ORDINE PER RATING
        // ottengo il parametro orderByRating 
        $orderByRating = $request->query->get('orderByRating');

        // Verifica se il valore di orderByRating è valido, se non è valido lo imposto ASC
        if ($orderByRating !== "ASC" && $orderByRating !== "DESC") {
            
            $orderByRating = "ASC";
        }

    
        $moviesByYear = $this->movieRepository->findOrderedByYear($orderByYear);
        $moviesByRating = $this->movieRepository->findOrderedByRating($orderByRating);

        $dataByYear = $this->serializer->serialize($moviesByYear, "json", ["groups" => "default"]);
        $dataByRating = $this->serializer->serialize($moviesByRating, "json", ["groups" => "default"]);

        $responseData = [
            'moviesByYear' => json_decode($dataByYear, true),
            'moviesByRating' => json_decode($dataByRating, true)
        ];

        return new JsonResponse($responseData);

        
    }

    
    
}
