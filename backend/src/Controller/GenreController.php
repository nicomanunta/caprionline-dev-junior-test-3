<?php

namespace App\Controller;

use App\Repository\GenreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use App\Entity\Genre;



class GenreController extends AbstractController
{
    public function __construct(
        private GenreRepository $genreRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/genres', methods: ['GET'])]
    public function listGenres(): JsonResponse
    {

        $genres = $this->genreRepository->findAll();
      
        $data = $this->serializer->serialize($genres, 'json', ['groups' => 'default']);
    


        return new JsonResponse($data, json: true);
    }
}
